

type Props = {
  prop1: string;
  prop2: string;
};

export default function ExampleComponent({ prop1 = 'Hello', prop2 = 'World' }: Props) {

  return (
    <div>
      {prop1}
      {prop2}
    </div>
  );
}