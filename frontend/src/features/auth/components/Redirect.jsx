import { Link } from "react-router-dom";

const Redirect = ({ title = "", to = "", subtitle = "" }) => {
  return (
    <div>
      <p className="text-center eczar text-sm text-background-light flex gap-1 items-center justify-center">
        {subtitle}
        <Link to={to} className="font-semibold teko transition-colors text-gold">
          {title}
        </Link>
      </p>
    </div>
  );
};

export default Redirect;
