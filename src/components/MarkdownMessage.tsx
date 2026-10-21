import { Fragment, type ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\n]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function headingLevel(line: string): number {
  const match = /^(#{1,6})\s+/.exec(line);
  return match ? match[1].length : 0;
}

export function MarkdownMessage({ text }: { text: string }) {
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      i += 1;
      const code: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push(
        <div key={key++} className="md-code">
          {lang ? <p className="eyebrow">{lang}</p> : null}
          <CodeBlock code={code.join("\n")} />
        </div>,
      );
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      blocks.push(<hr key={key++} />);
      i += 1;
      continue;
    }

    const heading = headingLevel(line);
    if (heading) {
      const content = inline(line.replace(/^#{1,6}\s+/, "").replace(/\s*#+\s*$/, ""), `h${key}`);
      blocks.push(
        <p key={key++} className={`md-h md-h${heading}`}>
          {content}
        </p>,
      );
      i += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+\.\s+/.test(lines[i]) : /^\s*[-*]\s+/.test(lines[i]))) {
        items.push(lines[i].replace(ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/, ""));
        i += 1;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={key++} className="md-list">
          {items.map((item, idx) => (
            <li key={idx}>{inline(item, `li-${key}-${idx}`)}</li>
          ))}
        </List>,
      );
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && headingLevel(lines[i]) === 0 && !lines[i].startsWith("```") && !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]) && !/^\s*---+\s*$/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={key++}>
        {para.map((row, idx) => (
          <Fragment key={idx}>
            {idx > 0 ? <br /> : null}
            {inline(row, `p-${key}-${idx}`)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return <div className="md-body">{blocks}</div>;
}
