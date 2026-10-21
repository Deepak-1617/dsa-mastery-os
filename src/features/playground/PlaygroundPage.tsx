import { lazy, Suspense, useEffect, useState } from "react";
import { DEFAULT_RUNTIME, runJavaSource, type ExecutionResult, type JavaRuntimeInfo } from "../../lib/javaRunner";
import { errorMessage } from "../../lib/errors";
import { getDraft, saveDraft } from "../../store/api";

const Editor = lazy(() => import("@monaco-editor/react"));
const DRAFT_ID = "playground:main";

const TEMPLATES: { id: string; name: string; stdin: string; code: string }[] = [
  {
    id: "hello",
    name: "Hello World",
    stdin: "",
    code: `import java.util.*;

class Main {
    public static void main(String[] args) {
        System.out.println("Hello, DSA Mastery OS");
    }
}
`,
  },
  {
    id: "read-array",
    name: "Read n integers",
    stdin: "5\n4 9 2 11 3\n",
    code: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = sc.nextInt();
        }
        System.out.println("n = " + n);
        System.out.println(Arrays.toString(numbers));
    }
}
`,
  },
  {
    id: "max",
    name: "Find maximum",
    stdin: "5\n4 9 2 11 3\n",
    code: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();

        int maximum = numbers[0];
        for (int value : numbers) {
            if (value > maximum) maximum = value;
        }
        System.out.println(maximum);
    }
}
`,
  },
  {
    id: "reverse",
    name: "Reverse in place",
    stdin: "6\n1 2 3 4 5 6\n",
    code: `import java.util.*;

class Main {
    static void reverse(int[] numbers) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int temp = numbers[left];
            numbers[left] = numbers[right];
            numbers[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        reverse(numbers);
        for (int i = 0; i < n; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(numbers[i]);
        }
        System.out.println();
    }
}
`,
  },
];

export function PlaygroundPage() {
  const [code, setCode] = useState(() => getDraft(DRAFT_ID) ?? TEMPLATES[0].code);
  const [stdin, setStdin] = useState(TEMPLATES[1].stdin);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [runtime, setRuntime] = useState<JavaRuntimeInfo>(DEFAULT_RUNTIME);

  useEffect(() => {
    const incoming = sessionStorage.getItem("dsa-mastery-os:playground-code");
    if (incoming) {
      setCode(incoming);
      saveDraft(DRAFT_ID, incoming);
      sessionStorage.removeItem("dsa-mastery-os:playground-code");
    }
    const incomingStdin = sessionStorage.getItem("dsa-mastery-os:playground-stdin");
    if (incomingStdin != null) {
      setStdin(incomingStdin);
      sessionStorage.removeItem("dsa-mastery-os:playground-stdin");
    }
  }, []);

  function onChange(value: string | undefined) {
    const next = value ?? "";
    setCode(next);
    saveDraft(DRAFT_ID, next);
  }

  function loadTemplate(id: string) {
    const template = TEMPLATES.find((item) => item.id === id);
    if (!template) return;
    setCode(template.code);
    setStdin(template.stdin);
    saveDraft(DRAFT_ID, template.code);
    setResult(null);
    setError("");
  }

  async function onRun() {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const output = await runJavaSource(code, stdin);
      setResult(output.result);
      setRuntime(output.runtime);
    } catch (err) {
      setError(errorMessage(err, "Java runner is unavailable."));
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="page playground-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">JAVA PLAYGROUND</p>
          <h1>Write, run, see the output.</h1>
          <p className="muted">
            Runs <strong>{runtime.label}</strong> on a remote sandbox. Your source is sent to that service to compile.
            This is a custom run, not a hidden-test verdict, and it does not mark problems solved.
            JDK 25 is not on this runner. If Wandbox is down, the app falls back to Piston Java 15.
          </p>
        </div>
        <button className="button button-primary" onClick={onRun} disabled={running}>
          {running ? "Running…" : "Run Java"}
        </button>
      </header>

      <div className="template-row">
        {TEMPLATES.map((template) => (
          <button key={template.id} className="button button-secondary" type="button" onClick={() => loadTemplate(template.id)}>
            {template.name}
          </button>
        ))}
      </div>

      <div className="playground-layout">
        <div className="editor-frame">
          <Suspense fallback={<p className="muted">Loading editor…</p>}>
            <Editor
              height="520px"
              defaultLanguage="java"
              theme="vs-dark"
              value={code}
              onChange={onChange}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
            />
          </Suspense>
        </div>
        <aside className="playground-side">
          <label className="field-label" htmlFor="pg-stdin">Standard input</label>
          <textarea id="pg-stdin" className="custom-input" rows={8} value={stdin} onChange={(e) => setStdin(e.target.value)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          {result && (
            <div className="run-result">
              <p>
                <strong>{result.status}</strong>
                <span className="muted"> · graded: false · {runtime.label}</span>
              </p>
              {result.compileOutput && (
                <>
                  <p className="eyebrow">COMPILER</p>
                  <pre>{result.compileOutput}</pre>
                </>
              )}
              <p className="eyebrow">STDOUT</p>
              <pre>{result.stdout || "(empty)"}</pre>
              {result.stderr && (
                <>
                  <p className="eyebrow">STDERR</p>
                  <pre>{result.stderr}</pre>
                </>
              )}
              {result.outputTruncated && <p className="muted">Output was truncated.</p>}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
