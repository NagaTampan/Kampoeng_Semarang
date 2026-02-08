import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Type
} from 'lucide-react';
import { Button } from './ui/button';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            BubbleMenuExtension.configure({
                element: null, // TipTap handles this when using the BubbleMenu component
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false, // Prevents SSR/Hydration issues
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="relative w-full border border-white/10 rounded-2xl bg-white/5 min-h-[200px] overflow-hidden group focus-within:border-primary/50 transition-all">
            {editor && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 100 }}
                    className="flex items-center gap-1 p-1.5 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-200"
                >
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('bold') ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('italic') ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('underline') ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('paragraph') ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Type className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('bulletList') ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('orderedList') ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`w-9 h-9 p-0 rounded-lg ${editor.isActive('blockquote') ? 'bg-primary text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Quote className="w-4 h-4" />
                    </Button>
                </BubbleMenu>
            )}

            <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none p-4 min-h-[160px] outline-none"
            />

            <style>{`
        .ProseMirror {
          min-height: 160px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #E6B940;
          padding-left: 1rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
        }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #E6B940; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #E6B940; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
