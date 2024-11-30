import { Link } from "react-router-dom";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function Card({ title, id, author }) {
  return (
    <CardContainer className="inter-var !max-w-80">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-transparent dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title.slice(0, 50)}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {author.slice(0, 100)}
        </CardItem>

        <div className="flex justify-between items-center mt-5">
          <Link to={`blog/${id}`}>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              View
            </CardItem>
          </Link>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export default Card;
