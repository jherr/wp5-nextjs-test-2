import { withRouter } from "next/router";

const Nav = (await import("test1/nav")).default;

export async function getStaticPaths() {
  return {
    paths: [1, 2, 3, 4, 5, 6].map((id) => ({
      params: {
        id: id.toString(),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  return {
    props: context.params,
  };
}

const SongPage = withRouter(({ id }) => (
  <div>
    <Nav />
    <div>Page for {id}</div>
  </div>
));

export default SongPage;
