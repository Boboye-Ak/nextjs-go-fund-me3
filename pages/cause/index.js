import Cause from "../../components/Cause";


export const getStaticPaths=async(context)=>{
    const id=context.params.id
    return {props:id}

}

const CausePage=({id})=>{
    return <div><Cause id={id}/></div>
}