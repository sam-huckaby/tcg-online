export default function GettingStartedMtg() {
    return <h1>Getting Started with Magic: The Gathering (MTG)</h1>
}

export async function getServerSideProps(context) {
let data = await fetch('https://flashmd.app/64dd41cd');
let info = await data.text();

console.log(info);

    return {
      props: {
        // props for your component
      }
    }
  }