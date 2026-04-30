import React, { useState } from 'react'
import styles from './PaintLibrary.module.scss'
import { usePaintLibrary } from '../../data/hooks/usePaintLibrary'
import tinycolor from 'tinycolor2'

const MEDIUMS: { value: string; label: string }[] = [
    { value: 'oil-paint', label: 'Oil Paint' },
    { value: 'acrylic-paint', label: 'Acrylic Paint' },
    { value: 'watercolor-paint', label: 'Watercolor' },
    { value: 'gouache-paint', label: 'Gouache' },
    { value: 'tempera-paint', label: 'Tempera' },
    { value: 'pastel-paint', label: 'Pastel' },
    { value: 'casein-paint', label: 'Casein' },
    { value: 'encaustic-paint', label: 'Encaustic' },
    { value: 'enamel-paint', label: 'Enamel' },
    { value: 'spray-paint', label: 'Spray Paint' },
    { value: 'airbrush-paint', label: 'Airbrush' },
    { value: 'marker-paint', label: 'Marker' },
    { value: 'fabric-paint', label: 'Fabric Paint' },
    { value: 'ceramic-paint', label: 'Ceramic Paint' },
    { value: 'glass-paint', label: 'Glass Paint' },
    { value: 'metal-paint', label: 'Metal Paint' },
    { value: 'body-paint', label: 'Body Paint' },
    { value: 'tattoo-paint', label: 'Tattoo Ink' },
    { value: 'glitter-paint', label: 'Glitter Paint' },
    { value: 'foam-paint', label: 'Foam Paint' },
    { value: 'calligraphy-paint', label: 'Calligraphy' },
]

interface PaintLibraryProps {
    addToPalette: (rgbString: string, includeRecipe: boolean, label?: string) => Promise<void>
}

const PaintLibrary: React.FC<PaintLibraryProps> = ({ addToPalette }) => {
    const [medium, setMedium] = useState('oil-paint')
    const [brand, setBrand] = useState('')

    const { filtered, brands, isLoading, error } = usePaintLibrary(medium, brand)

    const handleMediumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMedium(e.target.value)
        setBrand('')
    }

    return (
        <div className={ styles.PaintLibrary }>
            <div className={ styles.filters }>
                <select value={ medium } onChange={ handleMediumChange } aria-label="Medium">
                    { MEDIUMS.map(m => (
                        <option key={ m.value } value={ m.value }>{ m.label }</option>
                    )) }
                </select>
                <select
                    value={ brand }
                    onChange={ e => setBrand(e.target.value) }
                    disabled={ isLoading || brands.length === 0 }
                    aria-label="Brand"
                >
                    <option value="">All brands</option>
                    { brands.map(b => <option key={ b } value={ b }>{ b }</option>) }
                </select>
            </div>

            <div className={ styles.list } role="list">
                { isLoading && <p className={ styles.status }>Loading…</p> }
                { error && <p className={ styles.status }>{ error }</p> }
                { !isLoading && !error && filtered.length === 0 && (
                    <p className={ styles.status }>No colors found.</p>
                ) }
                { !isLoading && filtered.map((color, i) => {
                    const rgbString = `rgb(${ color.rgb })`
                    return (
                        <button
                            key={ `${ color.brand }-${ color.name }-${ i }` }
                            className={ styles.colorRow }
                            role="listitem"
                            onClick={ () => addToPalette(rgbString, false, color.name) }
                            title={ `${ color.brand } — ${ color.name }` }
                        >
                            <span
                                className={ styles.swatch }
                                style={ { background: color.hex } }
                                aria-hidden="true"
                            />
                            <span className={ styles.colorName }>{ color.name }</span>
                            <span className={ styles.brandName }>{ color.brand }</span>
                        </button>
                    )
                }) }
            </div>
        </div>
    )
}

export default PaintLibrary
