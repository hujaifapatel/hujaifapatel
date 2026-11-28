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
 * Kisi bhi template ko render karne ka ek hi entry point.
 * - page: 'home' | 'products' | 'contact'
 * - nav:  { mode: 'preview', go(page) } | { mode: 'router', base } | { mode: 'static' }
 * - strict: true => sirf user ka data (final site), false => khali fields me demo data
 */
export function TemplateRenderer({ template, data, page = 'home', nav, strict = false, fab = true }) {
  const Layout = layouts[template?.layout] || ClassicLayout;
  const content = <Layout template={template} data={mergeData(template, data, strict)} page={page} fab={fab} />;
  return nav ? <SiteNavContext.Provider value={nav}>{content}</SiteNavContext.Provider> : content;
}
