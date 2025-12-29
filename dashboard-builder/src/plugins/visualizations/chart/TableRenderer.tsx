// TableRenderer.tsx
import React from "react";
import { VisualizationRendererProps } from "../visualization-api";

export const TableRenderer: React.FC<
  VisualizationRendererProps<"table">
> = ({ width, height, data }) => {
  const rows = (data as any)?.rows ?? [];

  return (
    <div
      className="w-full h-full overflow-auto dark:bg-slate-800 bg-white"
      style={{ width, height }}
    >
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row:any, i: number) => (
            <tr key={i} className="border-b dark:border-slate-700">
              {row.map((cell: any, j: number) => (
                <td key={j} className="p-2 dark:text-gray-300 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
