export type AssetProps = {
  readonly type: string;
  readonly source: string;
  readonly id: string;
  readonly title: string;
  readonly url: string;
};

export class Asset {
  #props: AssetProps;

  constructor(props: AssetProps) {
    this.#props = props;
  }

  get id() {
    return this.#props.id;
  }

  get url() {
    return this.#props.url;
  }

  get source() {
    return this.#props.source;
  }

  get dir() {
    return `corpora/${this.#props.source}/${this.#props.title}`;
  }

  get contentPath() {
    return `${this.dir}/content.txt`;
  }
}
