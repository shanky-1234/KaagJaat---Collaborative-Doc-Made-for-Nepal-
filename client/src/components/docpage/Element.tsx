import type { RenderElementProps } from "slate-react";

/* Contains Elements: Basically Block Level Contents */

function Element({ attributes, children, element }: RenderElementProps) {
  const style: React.CSSProperties = {
    textAlign: element.align ?? "left",
    lineHeight: element.lineHeight ?? 1.5,
  };

  switch (element.type) {
    case "heading-one":
      return (
        <h1 {...attributes} className="text-5xl" style={style}>
          {children}
        </h1>
      );

    case "heading-two":
      return (
        <h2 {...attributes} className="text-3xl" style={style}>
          {children}
        </h2>
      );

    case "heading-three":
      return (
        <h3 {...attributes} className="text-xl" style={style}>
          {children}
        </h3>
      );

    case "page-break":
      return (
        <div
        {...attributes}
        contentEditable={false}
        data-type="page-break"
        className="pointer-events-none select-none"
          style={{height:0,overflow:'hidden'}}>
            {children}
      </div>
      )

    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
}

export default Element;
