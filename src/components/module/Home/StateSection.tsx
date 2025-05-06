export default function StatsSection() {
  const stats = [
    { value: "180+", label: "Expert Doctors" },
    { value: "26+", label: "Expert Services" },
    { value: "10K+", label: "Happy Patients" },
    { value: "150+", label: "Best Rated Doctors" },
  ];

  return (
    <section className="py-10 bg-green-500 text-white rounded-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
              <div className="text-sm md:text-base text-green-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
