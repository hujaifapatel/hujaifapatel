import ClassicLayout from './ClassicLayout.jsx';
import BoldLayout from './BoldLayout.jsx';
import MinimalLayout from './MinimalLayout.jsx';
import DarkLayout from './DarkLayout.jsx';
import { mergeData, SiteNavContext } from './shared.jsx';

export const layouts = {
  classic: ClassicLayout,
  bold: BoldLayout,
  minimal: MinimalLayout,
  dark: DarkLayout,
};

/**
 * The single entry point for rendering any template.
 * - page: 'home' | 'products' | 'contact'
 * - nav:  { mode: 'preview', go(page) } | { mode: 'router', base } | { mode: 'static' }
 * - strict: true => only the user's data (final website), false => demo data fills empty fields
 */
export function TemplateRenderer({ template, data, page = 'home', nav, strict = false, fab = true }) {
  const Layout = layouts[template?.layout] || ClassicLayout;
  const content = <Layout template={template} data={mergeData(template, data, strict)} page={page} fab={fab} />;
  return nav ? <SiteNavContext.Provider value={nav}>{content}</SiteNavContext.Provider> : content;
}
