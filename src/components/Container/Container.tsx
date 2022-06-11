type Props = {
  children: JSX.Element[];
};

const Container = ({ children }: Props) => {
  return <div className="flex flex-col min-h-screen">{children}</div>;
};
export default Container;
