export interface MemoProps {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Memo {
  private props: MemoProps;

  private constructor(props: MemoProps) {
    this.props = props;
  }

  public static create(props: MemoProps): Memo {
    return new Memo(props);
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get title(): string { return this.props.title; }
  get content(): string { return this.props.content; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}
