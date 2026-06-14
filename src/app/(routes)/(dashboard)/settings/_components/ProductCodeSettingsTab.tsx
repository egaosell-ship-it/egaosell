"use client";

import { Panel } from "@/components/common/Panel";
import AddProductCodeSettingModal from "./AddProductCodeSettingModal";
import EditProductCodeSettingModal from "./EditProductCodeSettingModal";
import ProductCodeSettingDeleteButton from "./ProductCodeSettingDeleteButton";
import { ProductCodeSettingProps } from "@/core/domain/entities/ProductCodeSetting";
import { PlatformMarginProps } from "@/core/domain/entities/PlatformMargin";

interface ProductCodeSettingsTabProps {
  settings: ProductCodeSettingProps[];
  margins: PlatformMarginProps[];
}

export default function ProductCodeSettingsTab({ settings, margins }: ProductCodeSettingsTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">상품코드설정</h2>
          <p className="text-sm text-on-surface-variant">플랫폼별 상품코드 구성 방식을 설정합니다.</p>
        </div>
        <AddProductCodeSettingModal margins={margins} />
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">플랫폼</th>
              <th className="px-4 py-3 whitespace-nowrap">공급상품명구분자1</th>
              <th className="px-4 py-3 whitespace-nowrap">공급상품명구분자2</th>
              <th className="px-4 py-3 whitespace-nowrap">가격정보구분자</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {settings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 상품코드설정이 없습니다.
                </td>
              </tr>
            ) : (
              settings.map((setting, index) => (
                <tr key={setting.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{setting.platformName}</td>
                  <td className="px-4 py-3">{setting.supplierNameDelimiter1}</td>
                  <td className="px-4 py-3">{setting.supplierNameDelimiter2}</td>
                  <td className="px-4 py-3">{setting.priceInfoDelimiter}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <EditProductCodeSettingModal margins={margins} setting={setting} />
                      <ProductCodeSettingDeleteButton id={setting.id as string} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
