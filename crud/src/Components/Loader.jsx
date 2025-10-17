


const Loader = ({loading}) => {
  return (
    <div>
        
{loading &&<div className="spinner-border text-primary" role="status">
  <span className="sr-only"></span>
</div>}

      
    </div>
    
  )
}

export default Loader
