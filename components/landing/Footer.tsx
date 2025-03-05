export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />
      <section className="container py-10 text-center">
        <h3>
          &copy; 2024 Landing page origin by{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.linkedin.com/in/leopoldo-miranda/"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Leo Miranda
          </a>
          <p>
            modified by{" "}
            <a
              rel="noreferrer noopener"
              href="https://github.com/pahmiudahgede/"
              target="_blank"
              className="text-primary transition-all border-primary hover:border-b-2"
            >
              Fahmi Kurniawan
            </a>
          </p>
        </h3>
      </section>
    </footer>
  );
};
