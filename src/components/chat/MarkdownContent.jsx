import { CheckSquare, Square } from "lucide-react";

/**
 * Component hiển thị nội dung Markdown chuẩn cho Chatbot Én Hỷ.
 * Hỗ trợ: Bảng (Table), Checklist [ ] [x], Tiêu đề, In đậm, Trích dẫn, Gạch đầu dòng.
 */
export default function MarkdownContent({ content }) {
  if (!content) return null;

  // Tách nội dung thành các dòng để phân tích cấu trúc
  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  // Hàm render inline formatting (in đậm, nghiêng, code inline)
  const renderInline = (text, keyPrefix = "") => {
    if (!text) return null;

    // Tách bold **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      const key = `${keyPrefix}-part-${idx}`;
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={key} className="font-semibold text-[#2C2117]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={key} className="italic text-[#6B5A4B]">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={key}
            className="rounded bg-[#F2ECE4] px-1.5 py-0.5 text-xs font-mono text-[#3B2A1A]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. XỬ LÝ BẢNG MARKDOWN (| Col 1 | Col 2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // Tách header và rows
        const headerCells = tableLines[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());

        // Bỏ qua dòng separator (|---|---|)
        const rowStartIndex = tableLines[1].includes("---") ? 2 : 1;
        const rows = tableLines.slice(rowStartIndex).map((rowLine) =>
          rowLine
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );

        elements.push(
          <div
            key={`table-${elements.length}`}
            className="my-3 overflow-x-auto rounded-xl border border-[#E8DFC8] bg-white shadow-xs"
          >
            <table className="min-w-full divide-y divide-[#E8DFC8] text-left text-xs">
              <thead className="bg-[#FAF5EC]">
                <tr>
                  {headerCells.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-3 py-2 font-bold text-[#3B2A1A] whitespace-nowrap"
                    >
                      {renderInline(h, `th-${hIdx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EBE0] bg-white">
                {rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={rIdx % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]/60"}
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-3 py-2 text-[#4A3B2C] align-top"
                      >
                        {renderInline(cell, `td-${rIdx}-${cIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 2. CHECKLIST (- [ ] hoặc - [x])
    if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ")) {
      const isChecked = trimmed.startsWith("- [x] ");
      const text = trimmed.slice(6);
      elements.push(
        <div
          key={`check-${i}`}
          className="my-1.5 flex items-start gap-2 rounded-lg bg-[#FAF7F2] p-2 border border-[#EFE7DC]"
        >
          {isChecked ? (
            <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
          )}
          <span
            className={`text-xs ${
              isChecked ? "line-through text-[#9E8E7E]" : "text-[#3B2A1A]"
            }`}
          >
            {renderInline(text, `check-text-${i}`)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    // 3. TIÊU ĐỀ (HEADINGS)
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2
          key={`h1-${i}`}
          className="my-2.5 text-base font-bold text-[#2C2117] border-b border-[#EAE3D8] pb-1"
        >
          {renderInline(trimmed.replace("# ", ""), `h1-${i}`)}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3
          key={`h2-${i}`}
          className="my-2 text-sm font-bold text-[#3B2A1A] flex items-center gap-1.5"
        >
          <span className="h-2 w-2 rounded-full bg-[#C5A059]"></span>
          {renderInline(trimmed.replace("## ", ""), `h2-${i}`)}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4
          key={`h3-${i}`}
          className="my-1.5 text-xs font-bold uppercase tracking-wider text-[#A07D3E]"
        >
          {renderInline(trimmed.replace("### ", ""), `h3-${i}`)}
        </h4>
      );
      i++;
      continue;
    }

    // 4. DANH SÁCH BULLET (- hoặc *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li
          key={`li-${i}`}
          className="ml-4 list-disc text-xs text-[#4A3B2C] leading-relaxed my-1"
        >
          {renderInline(trimmed.slice(2), `li-${i}`)}
        </li>
      );
      i++;
      continue;
    }

    // 5. TRÍCH DẪN / LƯU Ý (> text)
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-2 border-l-3 border-[#C5A059] bg-[#FAF6EE] px-3 py-1.5 rounded-r-lg text-xs italic text-[#5D4936]"
        >
          {renderInline(trimmed.slice(2), `quote-${i}`)}
        </blockquote>
      );
      i++;
      continue;
    }

    // 6. ĐƯỜNG KẺ NGANG (---)
    if (trimmed === "---" || trimmed === "***") {
      elements.push(<hr key={`hr-${i}`} className="my-2.5 border-t border-[#EAE3D8]" />);
      i++;
      continue;
    }

    // 7. DÒNG VĂN BẢN THƯỜNG (PARAGRAPH)
    if (trimmed.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="my-1 text-xs text-[#4A3B2C] leading-relaxed">
          {renderInline(line, `p-${i}`)}
        </p>
      );
    } else {
      // Dòng trống để tạo khoảng cách
      elements.push(<div key={`empty-${i}`} className="h-1.5" />);
    }

    i++;
  }

  return <div className="space-y-0.5 text-xs leading-relaxed">{elements}</div>;
}

