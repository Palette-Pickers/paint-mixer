import React, { useState } from 'react'
import styles from './AddColorUiComponent.module.scss'
import { MdAddCircleOutline } from 'react-icons/md'
import ColorPicker from '../ColorPicker/ColorPicker'
import PaintLibrary from '../PaintLibrary/PaintLibrary'

type Tab = 'picker' | 'library'

type Props = {
    showAddColorPicker: boolean
    addColor: any
    setShowAddColorPicker: (value: boolean) => void
    setAddColor: (color: any) => void
    confirmColor: () => void
    addToPalette: (rgbString: string, includeRecipe: boolean) => Promise<void>
}

const AddColorUIComponent: React.FC<Props> = ({
    showAddColorPicker,
    addColor,
    setShowAddColorPicker,
    setAddColor,
    confirmColor,
    addToPalette,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('picker')

    return (
        <div className={ styles.AddColorUIComponent }>
            { !showAddColorPicker && (
                <button
                    style={ {
                        visibility: showAddColorPicker ? 'hidden' : 'visible',
                        display: showAddColorPicker ? 'none' : 'block',
                        cursor: showAddColorPicker ? 'default' : 'pointer'
                    } }
                    onClick={ () => setShowAddColorPicker(!showAddColorPicker) }
                >
                    <MdAddCircleOutline data-testid="add-circle-outline" />
                </button>
            ) }

            { showAddColorPicker && (
                <div className={ styles.colorPickerContainer } data-testid="add-color-picker">
                    <div className={ styles.tabs }>
                        <button
                            className={ activeTab === 'picker' ? styles.activeTab : styles.tab }
                            onClick={ () => setActiveTab('picker') }
                        >
                            Color Picker
                        </button>
                        <button
                            className={ activeTab === 'library' ? styles.activeTab : styles.tab }
                            onClick={ () => setActiveTab('library') }
                        >
                            Paint Library
                        </button>
                    </div>

                    { activeTab === 'picker' && (
                        <ColorPicker
                            color={ addColor }
                            onChange={ (newColor) => { setAddColor(newColor) } }
                            onClose={ () => setShowAddColorPicker(false) }
                            onConfirm={ confirmColor }
                        />
                    ) }

                    { activeTab === 'library' && (
                        <div className={ styles.libraryWrapper }>
                            <button
                                className={ styles.libraryClose }
                                onClick={ () => setShowAddColorPicker(false) }
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <PaintLibrary addToPalette={ addToPalette } />
                        </div>
                    ) }
                </div>
            ) }
        </div>
    )
}

export default AddColorUIComponent
