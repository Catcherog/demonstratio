using System;
using System.Diagnostics;
using System.IO;
using System.Text;

// Minimal Poppler command adapter for pdf2image in the bundled renderer.
// Actual rasterization uses bundled pypdfium2 in poppler_compat.py.
public static class PopplerCompat
{
    public static int Main(string[] args)
    {
        string tool = Path.GetFileNameWithoutExtension(Environment.GetCommandLineArgs()[0]).ToLowerInvariant();
        string script = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "poppler_compat.py");
        var joined = new StringBuilder();
        foreach (string arg in args) joined.Append(" \"").Append(arg.Replace("\"", "\\\"")).Append("\"");
        var start = new ProcessStartInfo();
        string python = Environment.GetEnvironmentVariable("CODEX_RESUME_PYTHON");
        start.FileName = String.IsNullOrEmpty(python) ? "python" : python;
        start.Arguments = "\"" + script + "\" --tool " + tool + joined.ToString();
        start.UseShellExecute = false;
        start.CreateNoWindow = true;
        start.RedirectStandardOutput = true;
        start.RedirectStandardError = true;
        using (Process process = Process.Start(start))
        {
            string stdout = process.StandardOutput.ReadToEnd();
            string stderr = process.StandardError.ReadToEnd();
            process.WaitForExit();
            Console.Write(stdout);
            Console.Error.Write(stderr);
            return process.ExitCode;
        }
    }
}
