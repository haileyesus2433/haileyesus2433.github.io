import { escapeSvelte } from 'mdsvex';
import { createHighlighter, type ThemeRegistrationRaw } from 'shiki';
import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';

// Must match --code-bg in src/lib/styles/tokens.css.
const CODE_BG = { light: '#F1F4F2', dark: '#181E1C' };
const MIN_CONTRAST = 4.6;

function luminance(hex: string): number {
	const [r, g, b] = [0, 2, 4].map((i) => {
		const c = parseInt(hex.slice(1 + i, 3 + i), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

// Moves a color toward black or white in small steps until it reaches AA
// on the code background. Keeps the hue, so the theme still reads as itself.
function ensureContrast(hex: string, bg: string, towards: 0 | 255): string {
	let rgb = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16));
	const toHex = () => '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
	while (contrast(toHex(), bg) < MIN_CONTRAST) {
		rgb = rgb.map((c) => Math.round(c + (towards - c) * 0.05));
	}
	return toHex().toUpperCase();
}

function accessible(
	theme: ThemeRegistrationRaw,
	bg: string,
	towards: 0 | 255
): ThemeRegistrationRaw {
	const fix = (c: string | undefined) =>
		c && /^#[0-9a-f]{6}$/i.test(c) ? ensureContrast(c, bg, towards) : c;
	return {
		...theme,
		name: `${theme.name}-aa`,
		colors: { ...theme.colors, 'editor.foreground': fix(theme.colors?.['editor.foreground'])! },
		tokenColors: theme.tokenColors?.map((rule) =>
			// Rules with their own background (invalid tokens) are left alone.
			rule.settings.background
				? rule
				: { ...rule, settings: { ...rule.settings, foreground: fix(rule.settings.foreground) } }
		)
	};
}

const light = accessible(githubLight as ThemeRegistrationRaw, CODE_BG.light, 0);
const dark = accessible(githubDark as ThemeRegistrationRaw, CODE_BG.dark, 255);

const highlighter = await createHighlighter({
	themes: [light, dark],
	langs: ['rust', 'c', 'typescript', 'javascript', 'toml', 'yaml', 'json', 'bash', 'sql']
});

// Runs at build time. The output is static HTML with a CSS variable per theme,
// so no highlighter ships to the browser.
export function highlight(code: string, lang: string | null | undefined): string {
	const html = highlighter.codeToHtml(code, {
		lang: lang && highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
		themes: { light: light.name!, dark: dark.name! },
		defaultColor: false
	});
	return `{@html \`${escapeSvelte(html)}\`}`;
}
