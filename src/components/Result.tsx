interface Props {
  result?: number | string;
}

export default function Result(props: Props) {
  return (
    <button class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]">
      {props.result}
    </button>
  );
}
