PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;

-- HPI table definition
CREATE TABLE IF NOT EXISTS HPI (
    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Date1 DATE,
    RegionName TEXT,
    AreaCode TEXT,
    AveragePrice DECIMAL(15, 2),
    HPIINDEX DECIMAL(10, 2),
    IndexSA DECIMAL(10, 2),
    OneMonthChange DECIMAL(5, 2),
    TwelveMonthChange DECIMAL(5, 2),
    AveragePriceSA DECIMAL(15, 2),
    SalesVolume INT,
    DetachedPrice DECIMAL(15, 2),
    DetachedIndex DECIMAL(10, 2),
    DetachedOneMonthChange DECIMAL(5, 2),
    DetachedTwelveMonthChange DECIMAL(5, 2),
    SemiDetachedPrice DECIMAL(15, 2),
    SemiDetachedIndex DECIMAL(10, 2),
    SemiDetachedOneMonthChange DECIMAL(5, 2),
    SemiDetachedTwelveMonthChange DECIMAL(5, 2),
    TerracedPrice DECIMAL(15, 2),
    TerracedIndex DECIMAL(10, 2),
    TerracedOneMonthChange DECIMAL(5, 2),
    TerracedTwelveMonthChange DECIMAL(5, 2),
    FlatPrice DECIMAL(15, 2),
    FlatIndex DECIMAL(10, 2),
    FlatOneMonthChange DECIMAL(5, 2),
    FlatTwelveMonthChange DECIMAL(5, 2),
    CashPrice DECIMAL(15, 2),
    CashIndex DECIMAL(10, 2),
    CashOneMonthChange DECIMAL(5, 2),
    CashTwelveMonthChange DECIMAL(5, 2),
    CashSalesVolume INT,
    MortgagePrice DECIMAL(15, 2),
    MortgageIndex DECIMAL(10, 2),
    MortgageOneMonthChange DECIMAL(5, 2),
    MortgageTwelveMonthChange DECIMAL(5, 2),
    MortgageSalesVolume INT,
    FTBPrice DECIMAL(15, 2),
    FTBIndex DECIMAL(10, 2),
    FTBOneMonthChange DECIMAL(5, 2),
    FTBtwelveMonthChange DECIMAL(5, 2),
    FOOPrice DECIMAL(15, 2),
    FOOIndex DECIMAL(10, 2),
    FOOOneMonthChange DECIMAL(5, 2),
    FOOTwelveMonthChange DECIMAL(5, 2),
    NewPrice DECIMAL(15, 2),
    NewIndex DECIMAL(10, 2),
    NewOneMonthChange DECIMAL(5, 2),
    NewTwelveMonthChange DECIMAL(5, 2),
    NewSalesVolume INT,
    OldPrice DECIMAL(15, 2),
    OldIndex DECIMAL(10, 2),
    OldOneMonthChange DECIMAL(5, 2),
    OldTwelveMonthChange DECIMAL(5, 2),
    OldSalesVolume INT
);

-- NationalityData table
CREATE TABLE IF NOT EXISTS NationalityData (
    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Flow VARCHAR(50),
    Period VARCHAR(50),
    AllNationalities INT,
    British INT,
    EU INT,
    NonEU INT
);

-- EstimateData table
CREATE TABLE IF NOT EXISTS EstimateData (
    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Flow VARCHAR(50),
    Period VARCHAR(50),
    Estimate DECIMAL(15, 2),
    LowerBound DECIMAL(15, 2),
    TwentyFivePercentLimit DECIMAL(15, 2),
    SeventyFivePercentLimit DECIMAL(15, 2),
    UpperBound DECIMAL(15, 2)
);

-- ReasonsData table
CREATE TABLE IF NOT EXISTS ReasonsData (
    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Flow VARCHAR(50),
    Period VARCHAR(50),
    AllReasons INT,
    Work INT,
    WorkDependant INT,
    Study INT,
    StudyDependant INT,
    Family INT,
    Other INT,
    HumanitarianBNO INT,
    HumanitarianResettlement INT,
    HumanitarianUkraine INT,
    Asylum INT
);

-- NationalityAndReasonsData table
CREATE TABLE IF NOT EXISTS NationalityAndReasonsData (
    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Nationality VARCHAR(50),
    Flow VARCHAR(50),
    Period VARCHAR(50),
    AllReasons INT,
    Work INT,
    Study INT,
    Family INT,
    Other INT
);

-- ImmigrationEmigrationData table
CREATE TABLE IF NOT EXISTS ImmigrationEmigrationData (
    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Period VARCHAR(50),
    Publication VARCHAR(50),
    ImmigrationAll INT,
    ImmigrationBritish INT,
    ImmigrationEU INT,
    ImmigrationNonEU INT,
    EmigrationAll INT,
    EmigrationBritish INT,
    EmigrationEU INT,
    EmigrationNonEU INT,
    NetAll INT,
    NetBritish INT,
    NetEU INT,
    NetNonEU INT
);

COMMIT;
