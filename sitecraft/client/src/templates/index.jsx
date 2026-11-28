import ClassicLayout from './ClassicLayout.jsx';
import BoldLayout from './BoldLayout.jsx';
import MinimalLayout from './MinimalLayout.jsx';
import DarkLayout from './DarkLayout.jsx';
import { mergeData } from './shared.jsx';

export const layouts = {
  classic: ClassicLayout,
  bold: BoldLayout,
  minimal: MinimalLayout,
  dark: DarkLayout,
};

// Kisi bhi template ko render karne ka ek hi entry point
export function TemplateRenderer({ template, data, strict = false, fab = true }) {
  const Layout = layouts[template?.layout] || ClassicLayout;
  return <Layout template={template} data={mergeData(template, data, strict)} fab={fab} />;
}
