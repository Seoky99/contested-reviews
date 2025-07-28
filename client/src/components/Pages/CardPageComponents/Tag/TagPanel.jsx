import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./TagPanel.module.css";
import z from "zod";
import TagList from "./TagList";
import axiosPrivate from "../../../../customHooks/store/useAxiosPrivate";

function TagPanel({selectedTags, setSelectedTags, setTags, setSetTags, userSetId, toggleTag, handleDeleteTag, viewTaggedCards}) {
    const noTags = setTags.length === 0; 
    userSetId = Number(userSetId);

     async function handleCreatingTag(data) {
        const body = {...data, userSetId};
        console.log(body);

        try {
            const url = `tags`;
            const successTag = (await axiosPrivate.post(url, body, {
                headers: {'Content-Type': 'application/json'},
            })).data;

            successTag.tagCount = 1;

            const newSet = new Set(selectedTags); 
            newSet.add(successTag.tagId);

            setSelectedTags(newSet);
            setSetTags([...setTags, successTag]);

        } catch (err) {
            console.log(err); 
        }
    }

    const tagSchema = z.object({
        tagName: z.string().trim().min(1, {message: "Tag name required"}).max(20, {message: "Max 20 characters"}).regex(/^[a-zA-Z0-9 _-]+$/, {
        message: "Only letters, numbers, spaces, dashes, underscores allowed",
        }),
    });

    const { register, handleSubmit, formState: {errors, isSubmitting}} = useForm({resolver: zodResolver(tagSchema)});

    return (
        <div className={`${styles.tagPanel} ${styles.slideIn}`}>
            {!noTags && <div>
                {/*<p className={styles.reminder}>Use Existing Tags:</p> */}
                <TagList setTags={setTags} handleDelete={handleDeleteTag} toggleTag={toggleTag} selectedTags={selectedTags}
                         viewTaggedCards={viewTaggedCards}></TagList>
            </div>}
            <div className={styles.formWrapper}>
                <form className={styles.createTag} onSubmit={handleSubmit(handleCreatingTag)}>
                   <div><input className={styles.createInput} type="text" name="tagName" {...register("tagName")} placeholder="Your tag name!"></input>
                        {errors.tagName && <p className={styles.error}>{errors.tagName.message}</p>}
                   </div>
                   <button className={styles.createTagButton} disabled={isSubmitting}>{isSubmitting ? `Creating...` : `Create!`}</button>
                </form>
            </div>
        </div>
    );
}

export default TagPanel;