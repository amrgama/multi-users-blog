import React from 'react'
import BreadCrumb from '../componentes/breadCrumb/BreadCrumb';
import BigCard from '../componentes/postCards/BigCard';
import { data } from '../assets/data';
import CategoriesLinks from '../componentes/ui-kits/CategoriesLinks';
import TagsLinks from '../componentes/ui-kits/TagsLinks';
import useMediaQuery from '../hooks/useMediaQuery';

const LatestNews = () => {
    const matches_lg = useMediaQuery("(min-width: 992px)");
    const matches_md = useMediaQuery("(min-width: 576px)");
    const style_card= matches_md? {height: "300px"} : undefined;

    const renderedPostCards = data.map((post, i)=>{
        return <BigCard key={i} postData={post} style={style_card}/>
    })

    return (
    <div id="latestNews">
        <BreadCrumb title={"latest news"}/>
        <section className='py-5'>
            <div className="container">
               <div className="row justify-content-between gap-5 m-0">
                    <div className='col-12 col-lg d-flex flex-column gap-5 p-0 order-2 order-lg-1'>
                        {renderedPostCards}
                    </div>
                    <div className='col position-lg-sticky d-flex flex-column gap-5 p-0 order-1 order-lg-2'
                    style={{maxWidth: `${matches_lg? "360px": ""}`, height: "fit-content", top: "1.5rem"}}>
                        <CategoriesLinks label={"Categories"} matchWith={[data[0].category]} />
                        <TagsLinks label={"Tags"} matchWith={data[0].tags} />
                    </div>
                </div>
            </div>    
        </section>
    </div>
  )
}

export default LatestNews