using System;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace Backend.Helpers
{
    public static class ConfigurationHelper
    {
        public static IConfiguration LoadConfiguration()
        {
            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonConfiguration()
                .AddEnvironmentVariables()
                .Build();
        }

        private static IConfigurationBuilder AddJsonConfiguration(this IConfigurationBuilder builder)
        {
            builder.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (!string.IsNullOrEmpty(environment))
            {
                builder.AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true);
            }

            if (File.Exists(".env"))
            {
                builder.AddJsonFile(".env", optional: true, reloadOnChange: true);
            }

            return builder;
        }
    }
}
           