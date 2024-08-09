function Hero() {
  return (
    <section className="bg-[#19b394] text-white p-8 text-center">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to the Scholarship Portal
        </h1>
        <p className="mt-4 text-lg md:text-2xl">
          Your gateway to a brighter future. Apply for scholarships and grants
          today.
        </p>
        <button className="mt-6 bg-white text-[#19b394] px-4 py-2 rounded-full text-lg md:text-xl font-semibold">
          Get Started
        </button>
      </div>
    </section>
  );
}

export default Hero;
