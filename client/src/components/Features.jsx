function Features() {
  return (
    <section className="p-8 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Wide Range of Scholarships
            </h3>
            <p>
              We offer scholarships for all levels of education. From high
              school to postgraduate.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Easy Application Process
            </h3>
            <p>
              Apply for multiple scholarships with a single application form.
              Simple and hassle-free.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Support and Guidance</h3>
            <p>
              Get expert advice and guidance throughout the application process
              from our team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
