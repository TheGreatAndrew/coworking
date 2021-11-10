import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

// Local Imports
import styles from "./styles.module.scss";
import Member from "./Member";

type MemberProps = {
  _id: string;
  username: string;
  image: string;
};

type MembersProps = {
  owner: string;
  members: MemberProps[];
  loading: boolean;
};

const Members: React.FC<MembersProps> = (props) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Members</p>
      {props.loading ? (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.wrapper}>
          {props.members.map((member) =>
            member._id != props.owner ? null : (
              <Member
                key={member?._id}
                _id={member?._id}
                username={member?.username + " (Owner) " }
                image={member?.image}
              />
            )
          )}

          {props.members.map((member) =>
            member._id == props.owner ? null : (
              <Member
                key={member?._id}
                _id={member?._id}
                username={member?.username}
                image={member?.image}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Members;
