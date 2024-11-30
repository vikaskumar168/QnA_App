import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/providers/auth-provider";
import axios from "axios";
import Cookies from "js-cookie";
import { User } from "lucide-react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { toast } from "sonner";

CommentCard.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
};

export default function CommentCard({
  name,
  rating,
  text,
  commentId,
}) {
  const totalStars = 5;

  const { user } = useContext(AuthContext);


  // Generate an array of star components based on the rating
  const stars = Array.from({ length: totalStars }, (_, index) => {
    if (index < rating) {
      return <StarIcon className="w-5 h-5 fill-primary" key={index} />;
    } else {
      return (
        <StarIcon
          className="w-5 h-5 fill-muted stroke-muted-foreground"
          key={index}
        />
      );
    }
  });

  async function deleteComment() {
    const backendURL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
    const token = Cookies.get("authtoken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.delete(
        `${backendURL}/comments/deletecomment/${commentId}`,
        config
      );
      if (res.status === 200) {
        console.log("Comment deleted successfully");
      } else {
        console.log("Failed to delete comment");
      }
      toast.success("Succesfully your comment is deleted");
      window.location.reload(false);
    } catch (error) {
      toast.error(error);
      console.error("Error deleting comment:", error);
    }
  }

  return (
    <Card className="w-full p-6 grid gap-6 my-5">
      <div className="flex items-start gap-4 relative">
       
        <div className="grid gap-2 flex-1">
         
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{name}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={
            "absolute top-0 right-0" +
            (user.useremail !== name ? " hidden" : "")
          }
          disabled={user.useremail !== name}
          onClick={deleteComment}
        >
          <XIcon className="w-4 h-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
      <p className="text-muted-foreground">{text}</p>
    </Card>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
