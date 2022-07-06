import {Input} from './index'
const ObjectContainer = ({ schema }) => {
    console.log(schema);
    const { type, properties } = schema ?? {};

    return (
        <div>
            <h1>Hello form Object Container</h1>
            {
                type === 'object' ? (
                    <>
                        {
                            Object.keys(properties).map((item, index) => {
                                console.log(properties[item].type);
                                switch (properties[item].type) {
                                 case 'string':
                                    return <Input/>
                                     
                                 default:
                                     <h2>Vazio</h2>
                             }
                          })
                        }
                    </>
                ) : null
           }
        </div>
    )
}

export default ObjectContainer;