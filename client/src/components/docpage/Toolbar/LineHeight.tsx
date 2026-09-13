import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#components/ui/select';
import { ArrowDown01 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Editor, Element, Transforms } from 'slate';
import { useSlate } from 'slate-react';

interface LineHeightProps {
  editor: Editor
}

function LineHeight({ editor }: LineHeightProps) {
  const slateEditor = useSlate();
  const [value, setValue] = useState('1.5');

  const lineHeights = [
    { label: 'Single', value: '1' },
    { label: '1.15', value: '1.15' },
    { label: '1.5', value: '1.5' },
    { label: 'Double', value: '2' },
  ];

  useEffect(() => {
    const [current] = Editor.nodes(slateEditor, {
      at: slateEditor.selection ?? [],
      match: (node) => Element.isElement(node) && node.type !== 'text',
    });

    const currentLineHeight = current?.[0] && 'lineHeight' in current[0]
      ? Number(current[0].lineHeight ?? 1.5)
      : 1.5;

    setValue(String(currentLineHeight));
  }, [slateEditor, slateEditor.selection, slateEditor.children]);

  const handleChange = (nextValue: string) => {
    const lineHeight = Number(nextValue);
    setValue(nextValue);

    if (!slateEditor.selection) return;

    Transforms.setNodes(
      slateEditor,
      { lineHeight },
      {
        at: slateEditor.selection,
        match: (node) => Element.isElement(node) && node.type !== 'text',
      }
    );
  };

  return (
    <div>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-[110px]">
          <div className="flex items-center gap-2">
            <ArrowDown01 size={14} />
            <SelectValue placeholder="1.5" />
          </div>
        </SelectTrigger>
        <SelectContent className='bg-white'>
          {lineHeights.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LineHeight