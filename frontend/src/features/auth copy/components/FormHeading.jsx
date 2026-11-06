const FormHeading = ({ title = "", subtitle = "" }) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl text-primary teko tracking-[0.2rem]  font-bold  mb-1 text-center">{title}</h1>
      <p className="text-sm mb-7 mate text-background-subtle text-center">{subtitle}</p>
    </div>
  );
};

export default FormHeading;
