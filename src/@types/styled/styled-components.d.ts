declare module 'styled-components/native' {
  import * as React from 'react'
  import * as ReactNative from 'react-native'

  declare interface StyledFlatList {
    FlatList<T>(styles: any): new () => ReactNative.FlatList<T>
  }
  declare const styled: ReactNativeStyledInterface<DefaultTheme> & StyledFlatList
}