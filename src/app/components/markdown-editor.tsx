import { useScreenDetector } from "../hooks/use-screen-detector";
import { useCurrentTheme } from "../hooks/use-current-theme";
import { MdEditor, config } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import PT_BR from "../utils/locale/pt-br";

config({
  editorConfig: {
    languageUserDefined: {
      "pt-br": PT_BR,
    },
  },
});

interface MarkdownEditorProps {
  content: string;
  onChangeContent: (value: string) => void;
}

export function MarkdownEditor({
  content,
  onChangeContent,
}: MarkdownEditorProps) {
  const theme = useCurrentTheme();
  const { isMobile, deviceWidth, deviceHeight } = useScreenDetector();

  return (
    <div
      className="w-full overflow-x-auto"
      style={{
        maxWidth: isMobile ? deviceWidth - 26 : "",
        height: !isMobile ? deviceHeight - 300 : "",
      }}
    >
      <MdEditor
        modelValue={content}
        onChange={onChangeContent}
        autoFocus
        toolbarsExclude={[
          "image",
          "link",
          "save",
          "fullscreen",
          "pageFullscreen",
          "catalog",
          "htmlPreview",
          "github",
        ]}
        theme={theme}
        language="pt-br"
        className="rounded-md !h-64 md:!h-full"
        autoDetectCode
      />
    </div>
  );
}
