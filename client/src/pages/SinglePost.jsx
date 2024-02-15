import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
// import images from '../assets/images';
import BreadCrumb from '../componentes/breadCrumb/BreadCrumb';
import Article from '../componentes/singlePost/Article';
// import { data } from '../assets/data';
import CreateComment from '../componentes/singlePost/createComment/CreateComment';
import Comments from '../componentes/singlePost/comments/Comments';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, increaseReadings, selectPost } from '../features/post/postSlice';
import { CommentsContextProvider } from '../context/Comments';
// import PostLoading from '../componentes/singlePost/postTools/PostLoading';
import { toast } from 'react-toastify';
import SkeletonArticle from '../componentes/skeletonLoading/singlePost/SkeletonArticle';
// import SkeletonComment from '../componentes/skeletonLoading/singlePost/SkeletonComment';
// import {cash} from "../utils/helper";
import UserCard from '../componentes/singlePost/aside/AuthorInfo';
import MoreFromBloger from '../componentes/singlePost/aside/MoreFromBloger';
import PopularPosts from '../componentes/singlePost/aside/PopularPosts';
import { selectAuth } from '../features/auth/authSlice';
import useMediaQuery from '../hooks/useMediaQuery';

const SinglePost = () => {
    const params = useParams();
    const id = params.id;
    const commentsRef = useRef()
    const dispatch = useDispatch()
    const {post, isLoading, isSuccess, isError, message, meta} = useSelector(selectPost)
    const {user: authUser} = useSelector(selectAuth)
    const matches = useMediaQuery("(min-width: 992px)");

    // cash("post", {id,...post}, "session");

    commentsRef.current= (Object.keys(post).length)? [...post.comments.values]: [];
    console.log("commentRef in singlePost", commentsRef.current)
    const isFirstRender = useRef(true);

    useEffect(()=>{
        dispatch(getPost(id))
        return ()=> isFirstRender.current = false;
    }, [])

    useEffect(()=>{
        if(isSuccess && isFirstRender.current){
            console.log("isReader", authUser.id.toString() !== post.author._id.toString())
            dispatch(increaseReadings({postId: post._id, isReader: authUser.id.toString() !== post.author._id.toString()}))
        }
        if(!isSuccess && isError && message){
            console.log("from single post")
            toast.error(message)
        }
    }, [isLoading, isSuccess, isError, dispatch])

    return (
    <div id="singlePost">
        <BreadCrumb title={post?.title} ignor={"posts"}/>
        <section className='py-5'>
            <div className="container">
                <div className="row gap-4 m-0">
                    <div className='col-12 col-lg p-0 d-flex flex-column gap-5' style={{maxWidth: "800px"}}>
                        {
                            isLoading && !!!Object.keys(post).length &&
                            <SkeletonArticle />
                        }
                        {
                            !isLoading && !!Object.keys(post).length &&
                            <Article post={post} />
                        }
                        <div className="p-5 mt-3 bg-white">
                            <CommentsContextProvider commentsRef={commentsRef} initialVal={post?.comments?.values || []} >
                                <CreateComment />
                                {
                                    isSuccess && !!Object.keys(post).length && post?.comments.length &&
                                    <Comments comments={post?.comments}/>
                                }
                                {
                                    isSuccess && !!Object.keys(post).length && !post?.comments.length &&
                                    <span className="fs-4 text-muted bg-white">
                                        Be the first Reader who is comment
                                    </span>
                                }
                            </CommentsContextProvider>
                        </div>
                    </div>
                    <div className='col position-sticky d-flex flex-column gap-5 p-0 mt-5 mt-lg-0'
                    style={{maxWidth: `${matches? "360px": ""}`, height: "fit-content", top: "1.5rem"}}>
                        {
                            !!Object.keys(post).length &&
                            <>
                                <UserCard author={post?.author} authUser={authUser}/>
                                <div className="w-100 d-flex flex-wrap gap-5">
                                    <MoreFromBloger bloggerId={post?.author._id} />
                                    <PopularPosts />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>    
        </section>
    </div>
  )
}

export default SinglePost