import type { SheetSettings } from "../constants";

type Props = {
  settings: SheetSettings;
};

export function SheetHeader({ settings }: Props) {
  return (
    <div className="sheet-header">
      <div className="header-col header-col-title">
        <div className="sheet-title header-vtext">{settings.title}</div>
        <div className="name-line header-vtext">{settings.nameLine}</div>
      </div>
      <div className="header-col header-col-instruction">
        <div className="sheet-instruction header-vtext">{settings.subtitle}</div>
      </div>
    </div>
  );
}
