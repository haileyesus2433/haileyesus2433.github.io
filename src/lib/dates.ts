// Dates are written YYYY-MM-DD in frontmatter. Format in UTC so the build
// machine's time zone can't shift a date by a day.
export function formatDate(iso: string): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
}
