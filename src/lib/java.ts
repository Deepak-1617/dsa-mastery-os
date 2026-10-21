export function javaMainClass(methodBlock: string, mainBody: string): string {
  return `import java.util.*;

public class Main {
${methodBlock}

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
${mainBody}
    }
}
`;
}

export function readIntArrayMain(call: string): string {
  return `        int n = input.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = input.nextInt();
        }
        ${call}`;
}

export function normalizeOutput(value: string): string {
  return value.replace(/\r\n/g, "\n").trimEnd();
}
