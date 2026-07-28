using System;
using System.Diagnostics;
using System.IO;

// Executable adapter required because render_docx.py invokes `soffice` through
// CreateProcess. It only supports the conversion argument shape used by that
// renderer, then delegates DOCX-to-PDF to the bundled Python compatibility
// renderer. This workspace does not expose an interactive Office/LibreOffice
// session to automation.
public static class SofficeCompat
{
    public static int Main(string[] args)
    {
        string outDir = null;
        string input = null;
        for (int i = 0; i < args.Length; i++)
        {
            if (args[i].Equals("--outdir", StringComparison.OrdinalIgnoreCase) && i + 1 < args.Length)
            {
                outDir = args[++i];
                continue;
            }
            if (args[i].EndsWith(".docx", StringComparison.OrdinalIgnoreCase)) input = args[i];
        }
        if (String.IsNullOrEmpty(outDir) || String.IsNullOrEmpty(input)) return 2;
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        string script = Path.Combine(baseDir, "docx_to_pdf_compat.py");
        var start = new ProcessStartInfo();
        string python = Environment.GetEnvironmentVariable("CODEX_RESUME_PYTHON");
        start.FileName = String.IsNullOrEmpty(python) ? "python" : python;
        start.Arguments = "\"" + script + "\" \"" + input + "\" --outdir \"" + outDir + "\"";
        start.UseShellExecute = false;
        start.CreateNoWindow = true;
        using (Process process = Process.Start(start))
        {
            process.WaitForExit();
            return process.ExitCode;
        }
    }
}
