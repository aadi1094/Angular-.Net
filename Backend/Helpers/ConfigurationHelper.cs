using System;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace Backend.Helpers
{
    public static class ConfigurationHelper
    {
        public static IConfiguration LoadConfiguration()
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            if (environment == "Development")
            {
                builder.AddUserSecrets<Program>();
            }

            return builder.Build();
        }
    }
}
           