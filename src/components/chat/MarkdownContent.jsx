import {
  CheckSquare,
  Square,
  Info,
  Clock,
  MapPin,
  Calendar,
  Check,
  Users,
  Leaf,
} from "lucide-react";

/**
 * Component hiển thị nội dung Markdown chuẩn Rich Card theo phong cách EverWeb AI Showcase.
 * Hỗ trợ:
 * 1. Khung Danh sách Khách mời (Guest Card) - [Users], Avatar chữ cái, Tag Ăn chay.
 * 2. Khung Thống kê RSVP (RSVP Card) - Bộ đếm số, Progress bar đa sắc, Thống kê tham dự.
 * 3. Khung Lịch trình Sự kiện (Schedule Timeline) - Mốc giờ, dải timeline chấm tròn, tag Mới thêm, MapPin.
 * 4. Bảng biểu, Checklist, Tiêu đề, Trích dẫn Markdown chuẩn.
 */
export default function MarkdownContent({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  // Hàm render inline formatting (in đậm, nghiêng, code inline)
  const renderInline = (text, keyPrefix = "") => {
    if (!text) return null;

    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      const key = `${keyPrefix}-part-${idx}`;
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={key} className="font-semibold text-[#1E1E24]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={key} className="italic text-stone-600">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={key}
            className="rounded-md bg-stone-100 border border-stone-200/70 px-1.5 py-0.5 text-xs font-mono text-[#1E1E24]"
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

    // 1. XỬ LÝ KHỐI KHÁCH MỜI (GUEST CARD - ```guests HOẶC ```guest)
    if (trimmed.startsWith("```guests") || trimmed.startsWith("```guest")) {
      i++;
      let headerTitle = "Gia đình khách mời";
      const guestItems = [];

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        const cur = lines[i].trim();
        if (cur) {
          if (!cur.startsWith("-") && !cur.startsWith("*") && guestItems.length === 0) {
            headerTitle = cur.replace(/^[#*[\]()]+\s*/, "").replace(/[#*[\]()]+$/, "");
          } else {
            const raw = cur.replace(/^[-*•]\s*/, "");
            const parts = raw.split(/\s*\|\s*/);
            const name = parts[0]?.trim() || "";
            const role = parts[1]?.trim() || "Khách mời";
            const diet = parts[2]?.trim() || (raw.toLowerCase().includes("chay") ? "Ăn chay" : null);
            const initial = name.trim().charAt(0).toUpperCase() || "K";
            guestItems.push({ name, role, diet, initial });
          }
        }
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) i++;

      elements.push(
        <div
          key={`guest-card-${elements.length}`}
          className="my-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-semibold text-[#231F1C]">
                {headerTitle}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Mới
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {guestItems.map((g, gIdx) => (
              <div
                key={gIdx}
                className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-white shadow-2xs border border-stone-200/50"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-700">
                    {g.initial}
                  </span>
                  <span className="font-medium text-[#231F1C]">{g.name}</span>
                  <span className="text-stone-400 text-[11px]">{g.role}</span>
                </div>
                {g.diet && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    <Leaf className="w-3 h-3" /> {g.diet}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-stone-400 pt-0.5 text-right">
            Đã đồng bộ với danh sách khách mời EverWeb
          </p>
        </div>
      );
      continue;
    }

    // 2. XỬ LÝ KHỐI THỐNG KÊ RSVP (RSVP CARD - ```rsvp)
    if (trimmed.startsWith("```rsvp")) {
      i++;
      let confirmed = 88;
      let total = 123;
      let attending = 74;
      let busy = 14;
      let noReply = 35;

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        const cur = lines[i].trim();
        const ratioMatch = cur.match(/(\d+)\s*\/\s*(\d+)/);
        if (ratioMatch) {
          confirmed = parseInt(ratioMatch[1], 10);
          total = parseInt(ratioMatch[2], 10);
        }
        const attendMatch = cur.match(/tham\s*dự\s*[:=]?\s*(\d+)/i);
        if (attendMatch) attending = parseInt(attendMatch[1], 10);

        const busyMatch = cur.match(/bận\s*[:=]?\s*(\d+)/i);
        if (busyMatch) busy = parseInt(busyMatch[1], 10);

        const noReplyMatch = cur.match(/chưa\s*(phản\s*hồi)?\s*[:=]?\s*(\d+)/i);
        if (noReplyMatch) noReply = parseInt(noReplyMatch[2] || noReplyMatch[1], 10);

        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) i++;

      const percent = Math.round((confirmed / (total || 1)) * 100);
      const attendPct = Math.round((attending / (total || 1)) * 100);
      const busyPct = Math.round((busy / (total || 1)) * 100);
      const noReplyPct = Math.max(0, 100 - attendPct - busyPct);

      elements.push(
        <div
          key={`rsvp-card-${elements.length}`}
          className="my-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-3 shadow-xs"
        >
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-serif font-medium text-[#231F1C]">
                {confirmed}
              </span>
              <span className="text-sm text-stone-400 ml-1">/ {total} khách</span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {percent}% phản hồi
            </span>
          </div>

          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden flex gap-0.5">
            <div style={{ width: `${attendPct}%` }} className="h-full bg-emerald-500 rounded-l-full" />
            <div style={{ width: `${busyPct}%` }} className="h-full bg-amber-400" />
            <div style={{ width: `${noReplyPct}%` }} className="h-full bg-stone-300 rounded-r-full" />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-stone-600">{attending} Tham dự</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-stone-600">{busy} Bận</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-300 shrink-0" />
              <span className="text-stone-600">{noReply} Chưa phản hồi</span>
            </div>
          </div>
        </div>
      );
      continue;
    }

    // 3. XỬ LÝ KHỐI LỊCH TRÌNH SỰ KIỆN (SCHEDULE TIMELINE - ```schedule HOẶC BẮT ĐẦU BẰNG GIỜ HH:MM)
    const isScheduleBlock = trimmed.startsWith("```schedule");
    const isTimeItem = trimmed.match(/^[-*•]?\s*(\d{1,2}:\d{2})\s*[-:–]?\s*(.*)$/);

    if (isScheduleBlock || isTimeItem) {
      if (isScheduleBlock) i++;

      const scheduleItems = [];
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (isScheduleBlock && cur.startsWith("```")) {
          i++;
          break;
        }

        const m = cur.match(/^[-*•]?\s*(\d{1,2}:\d{2})\s*[-:–]?\s*(.*)$/);
        if (m) {
          const time = m[1];
          const rawDetails = m[2].trim();
          let title = rawDetails;
          let location = "";
          const locSplit = rawDetails.split(/\s*[-–|@]\s*|\s+tại\s+/i);
          if (locSplit.length > 1) {
            title = locSplit[0].trim();
            location = locSplit.slice(1).join(" · ").trim();
          }
          scheduleItems.push({ time, title, location });
          i++;
        } else if (cur === "" && i + 1 < lines.length && lines[i + 1].trim().match(/^[-*•]?\s*(\d{1,2}:\d{2})/)) {
          i++;
        } else {
          if (!isScheduleBlock) break;
          i++;
        }
      }

      if (scheduleItems.length > 0) {
        elements.push(
          <div
            key={`schedule-${elements.length}`}
            className="my-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="text-xs font-semibold text-[#231F1C] truncate">
                  Lịch Trình Sự Kiện
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <Check className="w-3 h-3 text-emerald-600" /> {scheduleItems.length} sự kiện
              </span>
            </div>

            <div className="space-y-1.5 text-xs pt-0.5">
              {scheduleItems.map((item, idx, arr) => {
                const isFirst = idx === 0;
                const isLast = idx === arr.length - 1;
                const dotColor = isFirst
                  ? "bg-rose-500 ring-rose-200"
                  : isLast
                  ? "bg-emerald-500 ring-emerald-200"
                  : "bg-stone-400 ring-stone-200";

                const timeColor = isFirst
                  ? "text-rose-800 bg-rose-50 border-rose-200/60"
                  : isLast
                  ? "text-emerald-800 bg-emerald-50 border-emerald-200/60"
                  : "text-stone-700 bg-stone-100 border-stone-200";

                return (
                  <div key={idx} className="flex items-stretch gap-2.5">
                    <div className="flex flex-col items-center shrink-0 w-3.5 pt-2">
                      <div className={`w-2 h-2 rounded-full ring-4 ${dotColor}`} />
                      {idx < arr.length - 1 && (
                        <div className="w-0.5 flex-1 bg-stone-200/80 my-1 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 flex items-start gap-2.5 p-2 rounded-xl bg-white shadow-2xs border border-stone-200/50">
                      <div
                        className={`flex items-center gap-1 font-mono-num font-semibold px-2 py-0.5 rounded border shrink-0 text-[11px] ${timeColor}`}
                      >
                        <Clock className="w-3 h-3" /> {item.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-[#231F1C] truncate">
                            {renderInline(item.title, `sch-title-${idx}`)}
                          </p>
                          {(isFirst || isLast) && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded border bg-rose-50 text-rose-700 border-rose-200/70 whitespace-nowrap">
                              Mới thêm
                            </span>
                          )}
                        </div>
                        {item.location && (
                          <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 shrink-0" /> {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        continue;
      }
    }

    // 4. XỬ LÝ BẢNG MARKDOWN (| Col 1 | Col 2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());

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
            className="my-3 overflow-x-auto rounded-2xl border border-stone-200/80 bg-white shadow-2xs"
          >
            <table className="min-w-full divide-y divide-stone-200/60 text-left text-xs">
              <thead className="bg-stone-50/80">
                <tr>
                  {headerCells.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-3.5 py-2.5 font-semibold text-[#231F1C] whitespace-nowrap"
                    >
                      {renderInline(h, `th-${hIdx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 bg-white">
                {rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={rIdx % 2 === 0 ? "bg-white hover:bg-stone-50/50" : "bg-stone-50/30 hover:bg-stone-50/60"}
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-3.5 py-2.5 text-[#1E1E24] align-top"
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

    // 5. CHECKLIST (- [ ] hoặc - [x])
    if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ")) {
      const isChecked = trimmed.startsWith("- [x] ");
      const text = trimmed.slice(6);
      elements.push(
        <div
          key={`check-${i}`}
          className="my-1.5 flex items-start gap-2.5 rounded-xl bg-stone-50/70 p-2.5 border border-stone-200/70"
        >
          {isChecked ? (
            <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <Square className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
          )}
          <span
            className={`text-xs leading-relaxed ${
              isChecked ? "line-through text-stone-400" : "text-[#1E1E24]"
            }`}
          >
            {renderInline(text, `check-text-${i}`)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    // 6. TIÊU ĐỀ (HEADINGS)
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2
          key={`h1-${i}`}
          className="my-2.5 text-base font-bold text-[#231F1C] border-b border-stone-200/80 pb-1.5"
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
          className="my-2 text-sm font-bold text-[#231F1C] flex items-center gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-stone-700"></span>
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
          className="my-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500"
        >
          {renderInline(trimmed.replace("### ", ""), `h3-${i}`)}
        </h4>
      );
      i++;
      continue;
    }

    // 7. DANH SÁCH BULLET (- hoặc *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li
          key={`li-${i}`}
          className="ml-4 list-disc text-xs text-[#1E1E24] leading-relaxed my-1"
        >
          {renderInline(trimmed.slice(2), `li-${i}`)}
        </li>
      );
      i++;
      continue;
    }

    // 8. TRÍCH DẪN / LƯU Ý (> text)
    if (trimmed.startsWith("> ")) {
      elements.push(
        <div
          key={`quote-${i}`}
          className="my-2 flex items-start gap-2.5 border-l-2 border-stone-400 bg-stone-50/80 px-3.5 py-2.5 rounded-r-xl text-xs text-stone-700"
        >
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-500" />
          <div className="flex-1 leading-relaxed">{renderInline(trimmed.slice(2), `quote-${i}`)}</div>
        </div>
      );
      i++;
      continue;
    }

    // 9. ĐƯỜNG KẺ NGANG (---)
    if (trimmed === "---" || trimmed === "***") {
      elements.push(<hr key={`hr-${i}`} className="my-2.5 border-t border-stone-200/80" />);
      i++;
      continue;
    }

    // 10. DÒNG VĂN BẢN THƯỜNG (PARAGRAPH)
    if (trimmed.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="my-1 text-xs sm:text-sm text-[#1E1E24] leading-relaxed">
          {renderInline(line, `p-${i}`)}
        </p>
      );
    } else {
      elements.push(<div key={`empty-${i}`} className="h-1.5" />);
    }

    i++;
  }

  return <div className="space-y-0.5 text-xs leading-relaxed">{elements}</div>;
}
