using Microsoft.EntityFrameworkCore;
using Termo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TermoContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ServerConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var externalHttpService = new ExternalHttpService();



app.MapGet("/words", async (TermoContext context) =>
{
    var day = DateTime.Now.Date;
    var word = await context.DayWords.Where(p => p.Day == day).FirstOrDefaultAsync();

    if (word == null) 
        return Results.NotFound();



    return Results.Ok(word.Value);
});

app.MapPost("/words", async (TermoContext context, string word) =>
{
    var day = DateTime.Now.Date;
    var wordDb = new DayWord()
    {
        Day = day,
        Value = word
    };

    await context.DayWords.AddAsync(wordDb);
    await context.SaveChangesAsync();

    return Results.Ok(wordDb);
});

app.MapGet("/words/validations", async (TermoContext context, string word) =>
{
    if(word.Length != 5)
        return Results.BadRequest("Só palavras com 5 letras!");

    var words = await externalHttpService.GetWords();
    if (!words.Contains(word.ToLower()))
        return Results.BadRequest("Palavra não aceita.");

    var day = DateTime.Now.Date;
    var dayWord = await context.DayWords.Where(p => p.Day == day).FirstOrDefaultAsync();
    if (dayWord == null)
        return Results.NotFound("Palavra não encontrada");

    return Results.Ok(ValidateWord(dayWord.Value, word));

});


app.Run();

static WordResult ValidateWord(string dayWord, string wordAttempt)
{
    Letter[] letterResult = new Letter[dayWord.Length];

    for(int i = 0; i < wordAttempt.Length; i++)
    {
        var letterAttempt = wordAttempt[i];
        bool exists, rightPlace;

        exists = dayWord.Contains(letterAttempt);
        rightPlace = dayWord[i] == letterAttempt;

        letterResult[i] = new Letter(letterAttempt, exists, rightPlace);
    }

    return new WordResult(letterResult, dayWord == wordAttempt);
}

internal record WordResult(Letter[] Letters, bool Success);
internal record Letter(char Value, bool Exists, bool rightPlace);