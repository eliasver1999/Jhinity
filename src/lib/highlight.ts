import { codeToHtml } from 'shiki';

export async function highlight(
  code: string,
  lang: string = 'tsx'
): Promise<string> {
  return await codeToHtml(code, {
    lang,
    theme: 'github-dark-dimmed',
  });
}
