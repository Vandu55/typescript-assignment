import { useState, useMemo } from 'react';
import { cities, fuelTypes, getAvailableYears, City, FuelType } from '@/data/fuelPrices';
import { calculateMonthlyAverages } from '@/utils/dataProcessing';
import FilterSelect from './FilterSelect';
import FuelChart from './FuelChart';
import { Fuel, MapPin, Calendar } from 'lucide-react';

const Dashboard = () => {
  const availableYears = useMemo(() => getAvailableYears(), []);
  
  const [selectedCity, setSelectedCity] = useState<City>('Delhi');
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>('Petrol');
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || 2016);

  const chartData = useMemo(
    () => calculateMonthlyAverages(selectedCity, selectedFuelType, selectedYear),
    [selectedCity, selectedFuelType, selectedYear]
  );

  // Calculate summary stats
  const avgPrice = useMemo(() => {
    const validPrices = chartData.filter((d) => d.average > 0);
    if (validPrices.length === 0) return 0;
    return validPrices.reduce((sum, d) => sum + d.average, 0) / validPrices.length;
  }, [chartData]);

  const maxPrice = useMemo(() => Math.max(...chartData.map((d) => d.average)), [chartData]);
  const minPrice = useMemo(() => {
    const validPrices = chartData.filter((d) => d.average > 0);
    return validPrices.length > 0 ? Math.min(...validPrices.map((d) => d.average)) : 0;
  }, [chartData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Fuel className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Fuel Price Analytics
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Retail Selling Price of Petrol & Diesel in Metro Cities
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Filters */}
        <section className="mb-8" aria-label="Filters">
          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full" />
              Select Parameters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-start gap-3">
                <div className="mt-8 p-2 rounded-lg bg-accent/50 hidden sm:flex">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <FilterSelect
                    label="Metro City"
                    value={selectedCity}
                    options={cities}
                    onChange={(val) => setSelectedCity(val as City)}
                  />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-8 p-2 rounded-lg bg-accent/50 hidden sm:flex">
                  <Fuel className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <FilterSelect
                    label="Fuel Type"
                    value={selectedFuelType}
                    options={fuelTypes}
                    onChange={(val) => setSelectedFuelType(val as FuelType)}
                  />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-8 p-2 rounded-lg bg-accent/50 hidden sm:flex">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <FilterSelect
                    label="Calendar Year"
                    value={selectedYear}
                    options={availableYears}
                    onChange={(val) => setSelectedYear(Number(val))}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Price Statistics">
          <div className="bg-card rounded-xl border border-border p-4 md:p-5 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Yearly Average</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              ₹{avgPrice.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">per litre</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 md:p-5 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Maximum Price</p>
            <p className="text-2xl md:text-3xl font-bold text-chart-petrol">
              ₹{maxPrice.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">peak in {selectedYear}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 md:p-5 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Minimum Price</p>
            <p className="text-2xl md:text-3xl font-bold text-chart-diesel">
              ₹{minPrice.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">lowest in {selectedYear}</p>
          </div>
        </section>

        {/* Chart */}
        <section aria-label="Price Chart">
          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
            <FuelChart
              data={chartData}
              city={selectedCity}
              fuelType={selectedFuelType}
              year={selectedYear}
            />
          </div>
        </section>

        {/* Data Source */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Data Source:{' '}
            <a
              href="https://ppac.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Petroleum Planning and Analysis Cell (PPAC)
            </a>
            {' '}via{' '}
            <a
              href="https://ndap.niti.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              NITI Aayog NDAP
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
