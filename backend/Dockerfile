# ─── Build Stage ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["WebApplication1(hospital)/WebApplication1(hospital).csproj", "WebApplication1(hospital)/"]
RUN dotnet restore "WebApplication1(hospital)/WebApplication1(hospital).csproj"

# Copy all source files and publish
COPY . .
WORKDIR "/src/WebApplication1(hospital)"
RUN dotnet publish "WebApplication1(hospital).csproj" -c Release -o /app/publish /p:UseAppHost=false

# ─── Runtime Stage ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

# Railway dynamically assigns PORT — Program.cs reads it via Environment.GetEnvironmentVariable("PORT")
EXPOSE 8080

ENTRYPOINT ["dotnet", "WebApplication1(hospital).dll"]
