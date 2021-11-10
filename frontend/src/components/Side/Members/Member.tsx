import styles from "./styles.module.scss";

type MemberProps = {
  _id: string;
  username: string;
  image: string;
};

const Member: React.FC<MemberProps> = (props) => {
  return (
    <div className={styles.member}>
      <img className={styles.image} alt="User" src={props.image} />
      <p className={styles.username}>{props.username}</p>
    </div>
  );
};

export default Member;
