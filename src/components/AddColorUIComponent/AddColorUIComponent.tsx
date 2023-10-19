import React from 'react';
import styles from './AddColorUiComponent.module.scss';
import { MdAddCircleOutline } from 'react-icons/md';
import tinycolor from "tinycolor2";
import ColorPicker from '../ColorPicker/ColorPicker';

type Props = {
    showAddColorPicker: boolean;
    addColor: any;  // type could be improved
    setShowAddColorPicker: (value: boolean) => void;
    setAddColor: (color: any) => void;  // type could be improved
    confirmColor: () => void;
};

const AddColorUIComponent: React.FC<Props> = ({ showAddColorPicker, addColor, setShowAddColorPicker, setAddColor, confirmColor }) => {
    return (
        <div className={styles.AddColorUIComponent}>
            <button
                style={{
                    visibility: showAddColorPicker ? 'hidden' : 'visible',
                    display: showAddColorPicker ? 'none' : 'block',
                    cursor: showAddColorPicker ? 'default' : 'pointer'
                }}
                onClick={() => setShowAddColorPicker(!showAddColorPicker)}
            >
                <MdAddCircleOutline />
            </button>

            {showAddColorPicker && (
                <div
                    className={styles.colorPickerContainer}
                    style={{backgroundColor: tinycolor(addColor)?.toHexString()}}
                >
                    <ColorPicker
                        color={addColor}
                        onChange={(newColor) => {setAddColor(newColor);}}
                        onClose={() => setShowAddColorPicker(false)}
                        onConfirm={confirmColor}
                    />
                </div>
            )}
        </div>
    );
};

export default AddColorUIComponent;
