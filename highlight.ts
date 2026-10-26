import { escapeSvelte } from 'mdsvex';
import { createHighlighter, type ShikiTransformer, type ThemeRegistrationRaw } from 'shiki';
import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';

// Must match --code-bg and --note-line in src/lib/styles/tokens.css.
// Token colors must pass on both, since noted lines sit on the tint.
const CODE_BG = { light: ['#F1F4F2', '#E9F1EE'], dark: ['#181E1C', '#1C2623'] };
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
// on every code background. Keeps the hue, so the theme still reads as itself.
function ensureContrast(hex: string, bgs: string[], towards: 0 | 255): string {
	let rgb = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16));
	const toHex = () => '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
	while (bgs.some((bg) => contrast(toHex(), bg) < MIN_CONTRAST)) {
		rgb = rgb.map((c) => Math.round(c + (towards - c) * 0.05));
	}
	return toHex().toUpperCase();
}

function accessible(
	theme: ThemeRegistrationRaw,
	bgs: string[],
	towards: 0 | 255
): ThemeRegistrationRaw {
	const fix = (c: string | undefined) =>
		c && /^#[0-9a-f]{6}$/i.test(c) ? ensureContrast(c, bgs, towards) : c;
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

// Fence options, e.g. ```rust start=446 notes=451,454
// start: the first line's number in the source file, so the gutter matches GitHub.
// notes: source line numbers that have a margin note; they get a tint and an id.
function parseMeta(meta: string | null | undefined, lineCount: number, file: string) {
	const start = Number(/(?:^|\s)start=(\d+)/.exec(meta ?? '')?.[1] ?? 1);
	const notes = new Set(
		(/(?:^|\s)notes=([\d,]+)/.exec(meta ?? '')?.[1] ?? '').split(',').filter(Boolean).map(Number)
	);
	for (const n of notes) {
		if (n < start || n >= start + lineCount) {
			throw new Error(
				`${file}: note on line ${n} is outside the excerpt (${start}-${start + lineCount - 1})`
			);
		}
	}
	return { start, notes };
}

function annotate(start: number, notes: Set<number>): ShikiTransformer {
	return {
		pre(node) {
			node.properties.style = `${node.properties.style ?? ''};--line-start:${start - 1}`;
		},
		line(node, index) {
			const n = start + index - 1;
			if (notes.has(n)) {
				node.properties['data-note'] = String(n);
				this.addClassToHast(node, 'noted');
			}
		}
	};
}

// Runs at build time. The output is static HTML with a CSS variable per theme,
// so no highlighter ships to the browser.
export function highlight(
	code: string,
	lang: string | null | undefined,
	meta?: string | null,
	file = 'code block'
): string {
	const lineCount = code.replace(/\n$/, '').split('\n').length;
	const { start, notes } = parseMeta(meta, lineCount, file);
	const html = highlighter.codeToHtml(code, {
		lang: lang && highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
		themes: { light: light.name!, dark: dark.name! },
		defaultColor: false,
		transformers: [annotate(start, notes)]
	});
	return `{@html \`${escapeSvelte(html)}\`}`;
}
