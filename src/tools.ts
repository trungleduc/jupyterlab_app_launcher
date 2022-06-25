import { LabIcon } from '@jupyterlab/ui-components';
import { UUID } from '@lumino/coreutils'
export function iconFromText(content: string): LabIcon {
  const name = UUID.uuid4()
  const svgstr = `<svg class="jp-al-app-icon" width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><text x="0" y="24" fill="#000" style="font-size: 18px">${content.toUpperCase()}</text></svg>`;
  return new LabIcon({
    name,
    svgstr: svgstr
  });
}
